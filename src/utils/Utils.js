//checks if user has permission
export const hasPermission = (permissions, requiredPermission) => {
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some(role => permissions.includes(role));
  }
    return permissions.includes(requiredPermission);
  };
    //check if user has role permission
    export const hasRolePermission = (permissions, requiredPermission) => {
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

  //download regions data
  export const exportRegionsToCSV = (regions) => {
    if (regions.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = [
      "ID",
      "Region",
      "Description",
      "Coordinator(s)",
      "Counties",
      "Updated At",
    ];

    // Prepare CSV data rows
    const dataRows = regions.map((region, index) => {
      const coordinators =
        region.coordinators?.length > 0
          ? region.coordinators
              .map((c) => `${c.firstName} ${c.lastName}`)
              .join(", ")
          : "No coordinator assigned";

      return [
        index + 1,
        region.region || "N/A",
        region.description || "N/A",
        coordinators,
        "7788876", // This seems to be a hardcoded value in your table
        region.updatedAt || "N/A",
      ];
    });

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...dataRows.map((row) => row.map(escapeCSVValue).join(",")),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `regions_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to escape CSV values
  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

