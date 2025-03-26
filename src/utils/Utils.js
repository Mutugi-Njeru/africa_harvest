//checks if user has permission
export const hasPermission = (permissions, requiredPermission) => {
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some(role => permissions.includes(role));
  }
    return permissions.includes(requiredPermission);
  };

  //downloads users data
  export const exportToCSV = (users) => {
    const headers = [
      "User ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone (MSISDN)",
      "Roles",
      "Permissions",
      "Active Status",
      "Description",
      "Created At",
      "Updated At",
      "Is Regional Coordinator",
      "Is County Coordinator",
      "Is Subcounty Coordinator",
      "Is Ward Coordinator",
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      users
        .map((user) => {
          return [
            user.userId,
            `"${user.firstName}"`,
            `"${user.lastName}"`,
            user.email,
            user.msisdn,
            `"${user.roles.join(", ")}"`,
            `"${user.permissions.join(", ")}"`,
            user.isActive ? "Active" : "Inactive",
            `"${user.description}"`,
            user.createdAt,
            user.updatedAt,
            user.isRegionalCoordinator ? "Yes" : "No",
            user.isCountyCoordinator ? "Yes" : "No",
            user.isSubcountyCoordinator ? "Yes" : "No",
            user.isWardCoordinator ? "Yes" : "No",
          ].join(",");
        })
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //check if user has role permission
  export const hasRolePermission = (permissions, requiredPermission) => {
    if (Array.isArray(requiredPermission)) {
      return requiredPermission.some(role => permissions.includes(role));
    }
    return permissions.includes(requiredPermission);
  };