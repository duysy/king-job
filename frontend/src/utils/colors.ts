export const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-yellow-100 text-yellow-800";
    case "pushed":
      return "bg-blue-100 text-blue-800";
    case "accepted":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-teal-100 text-teal-800";
    case "disputed":
      return "bg-red-100 text-red-800";
    case "resolved":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
