async function fetchLatestCommit() {
    const repoOwner = "Richard080481"; // Replace with your GitHub username
    const repoName = "LineBot"; // Replace with your GitHub repo name
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch commit data.");
      }
      const commits = await response.json();
      const latestCommitDate = commits[0].commit.author.date;

      // Format the date
      const date = new Date(latestCommitDate);
      const formattedDate = date.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) + " " + date.toLocaleTimeString("zh-TW");

      // Update the target paragraph
      document.getElementById("last-updated").innerText = `Last updated on: ${formattedDate}`;
    } catch (error) {
      console.error("Error fetching commit data:", error);
    }
  }

  // Fetch the latest commit when the page loads
  fetchLatestCommit();
