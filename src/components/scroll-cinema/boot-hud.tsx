'use client';

export function BootHud() {
  return (
    <div className="cinema-boot-hud" aria-hidden>
      <div className="cinema-boot-hud__panel">
        <p className="cinema-boot-hud__label">MUSO.OS / DEPLOY SEQUENCE</p>
        <div className="cinema-boot-hud__bar">
          <span className="cinema-boot-hud__bar-fill" data-cinema-boot-progress />
        </div>
        <p className="cinema-boot-hud__status" data-cinema-boot-status>
          Initializing neural layout engine...
        </p>
      </div>
    </div>
  );
}
