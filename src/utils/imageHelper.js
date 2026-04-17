export const getImageUrl = (path) => {
  if (!path || path === "null") {
    return "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d";
  }

  // ✅ Cloudinary / external URL
  if (path.startsWith("http")) {
    return path;
  }

  // ✅ fallback (old local uploads)
  return `${process.env.REACT_APP_API_URL}/${path}`;
};
