import mapboxgl from "mapbox-gl";
import { saveAs } from "file-saver";
import { getStyleUrl } from "./styles";
import type { AppState } from "@/types";

const POSTER_W = 2480;
const POSTER_H = 3508; // A4 at 300dpi

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.translate(-12, -12);

  ctx.beginPath();
  // Heart path matching the SVG
  ctx.moveTo(19, 14);
  ctx.bezierCurveTo(20.49, 12.54, 22, 10.79, 22, 8.5);
  ctx.bezierCurveTo(22, 5.46, 19.54, 3, 16.5, 3);
  ctx.bezierCurveTo(14.74, 3, 13.168, 3.83, 12, 5.17);
  ctx.bezierCurveTo(10.832, 3.83, 9.26, 3, 7.5, 3);
  ctx.bezierCurveTo(4.46, 3, 2, 5.46, 2, 8.5);
  ctx.bezierCurveTo(2, 10.8, 3.5, 12.55, 5, 14);
  ctx.lineTo(12, 21);
  ctx.closePath();

  ctx.fillStyle = "#e63946";
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();
}

export async function exportPoster(state: AppState): Promise<void> {
  const {
    selectedStyle,
    center,
    zoom,
    markerLngLat,
    name1,
    name2,
    locationLabel,
    date,
    title,
  } = state;

  // Create offscreen container
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = `${POSTER_W}px`;
  container.style.height = `${POSTER_H}px`;
  document.body.appendChild(container);

  try {
    // Center on heart marker if placed, and zoom in closer for the poster
    const exportCenter = markerLngLat ?? center;
    const exportZoom = zoom + 2;

    // Create export map
    const exportMap = new mapboxgl.Map({
      container,
      style: getStyleUrl(selectedStyle),
      center: exportCenter,
      zoom: exportZoom,
      preserveDrawingBuffer: true,
      interactive: false,
      fadeDuration: 0,
      attributionControl: false,
    });

    // Wait for map to fully render
    await new Promise<void>((resolve) => {
      exportMap.once("idle", () => resolve());
    });

    // Ensure fonts are loaded
    await document.fonts.ready;

    // Get map canvas
    const mapCanvas = exportMap.getCanvas();

    // Create final composite canvas
    const canvas = document.createElement("canvas");
    canvas.width = POSTER_W;
    canvas.height = POSTER_H;
    const ctx = canvas.getContext("2d")!;

    // Draw map full-bleed
    ctx.drawImage(mapCanvas, 0, 0, POSTER_W, POSTER_H);

    // Draw heart marker on the map
    if (markerLngLat) {
      const point = exportMap.project(markerLngLat as [number, number]);
      drawHeart(ctx, point.x, point.y, 60);
    }

    // Semi-transparent panel for text at the bottom
    const panelW = 1400;
    const panelH = 520;
    const panelX = (POSTER_W - panelW) / 2;
    const panelY = POSTER_H - panelH - 120;
    const panelR = 40; // border radius

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(panelX + panelR, panelY);
    ctx.lineTo(panelX + panelW - panelR, panelY);
    ctx.quadraticCurveTo(panelX + panelW, panelY, panelX + panelW, panelY + panelR);
    ctx.lineTo(panelX + panelW, panelY + panelH - panelR);
    ctx.quadraticCurveTo(panelX + panelW, panelY + panelH, panelX + panelW - panelR, panelY + panelH);
    ctx.lineTo(panelX + panelR, panelY + panelH);
    ctx.quadraticCurveTo(panelX, panelY + panelH, panelX, panelY + panelH - panelR);
    ctx.lineTo(panelX, panelY + panelR);
    ctx.quadraticCurveTo(panelX, panelY, panelX + panelR, panelY);
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fill();
    ctx.restore();

    // Text inside panel
    const centerX = POSTER_W / 2;
    const textBase = panelY + 80;

    // Title
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "300 48px Georgia, serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "12px";
    ctx.fillText(title.toUpperCase(), centerX, textBase);
    ctx.letterSpacing = "0px";

    // Names
    if (name1 || name2) {
      ctx.font = "600 72px Georgia, serif";
      ctx.fillStyle = "#ffffff";
      const namesText = `${name1 || "___"} & ${name2 || "___"}`;
      ctx.fillText(namesText, centerX, textBase + 100);
    }

    // Decorative line
    ctx.beginPath();
    ctx.moveTo(centerX - 100, textBase + 140);
    ctx.lineTo(centerX + 100, textBase + 140);
    ctx.strokeStyle = "#e63946";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Location
    if (locationLabel) {
      ctx.font = "400 36px Georgia, serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.letterSpacing = "4px";
      ctx.fillText(locationLabel, centerX, textBase + 210);
      ctx.letterSpacing = "0px";
    }

    // Date
    if (date) {
      const parsed = new Date(date + "T00:00:00");
      const formatted = parsed.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      ctx.font = "300 32px Georgia, serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText(formatted, centerX, textBase + 270);
    }

    // Coordinates
    if (markerLngLat) {
      const lat =
        Math.abs(markerLngLat[1]).toFixed(4) +
        (markerLngLat[1] >= 0 ? "N" : "S");
      const lng =
        Math.abs(markerLngLat[0]).toFixed(4) +
        (markerLngLat[0] >= 0 ? "E" : "W");
      ctx.font = "300 28px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.letterSpacing = "3px";
      ctx.fillText(`${lat}  ${lng}`, centerX, textBase + 340);
      ctx.letterSpacing = "0px";
    }

    // Small heart at the bottom of panel
    drawHeart(ctx, centerX, textBase + 420, 24);

    // Export
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), "image/png");
    });

    const filename = `where-we-met${locationLabel ? `-${locationLabel.toLowerCase().replace(/[^a-z0-9]/g, "-")}` : ""}.png`;
    saveAs(blob, filename);

    // Cleanup
    exportMap.remove();
  } finally {
    document.body.removeChild(container);
  }
}
