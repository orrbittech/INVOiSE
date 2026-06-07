const MAX_LOGO_BYTES = 500 * 1024;

export function readFileAsDataUrl(
  file: File,
): Promise<{ dataUrl: string | null; error?: string }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve({ dataUrl: null, error: "Please choose an image file." });
      return;
    }

    if (file.size > MAX_LOGO_BYTES) {
      resolve({
        dataUrl: null,
        error: "Image must be smaller than 500KB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve({ dataUrl: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ dataUrl: null, error: "Failed to read file." });
    };
    reader.readAsDataURL(file);
  });
}
