export const getImageUrl = (path) => {
  if (!path) {
    return "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d";
  }

  // ✅ IF CLOUDINARY URL → RETURN DIRECTLY
  if (path.startsWith("http")) {
    return path;
  }

  // ✅ OTHERWISE (LOCAL FILE)
  const fixedPath = path.replace(/\\/g, "/");
  return `${process.env.REACT_APP_API_URL}/${fixedPath}`;
};
