import { defineRailway, github, project, service } from "railway/iac";

const REPO = "13RahulKhanna/eyfi-leaderboard";

export default defineRailway(() => {
  const backend = service("backend", {
    source: github(REPO, { branch: "main", rootDirectory: "backend" }),
    env: {
      NODE_ENV: "production",
    },
  });

  const frontend = service("frontend", {
    source: github(REPO, { branch: "main", rootDirectory: "frontend" }),
    env: {
      NODE_ENV: "production",
    },
  });

  return project("eyfi-leaderboard", {
    resources: [backend, frontend],
  });
});
