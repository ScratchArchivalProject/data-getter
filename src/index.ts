import pkg from "sqlite3";
const { Database } = pkg;

// the first published project has an ID of 104. there is no point in checking IDs before this because they're guaranteed to error
const start = 104;
const limit: number | null = null;

let currentID = start;
let successful = 0;
let failure = 0;
let time = 0;

const exit = () => {
  console.log();
  console.log(`\x1b[1m${currentID - start}\x1b[0m projects fetched, \x1b[1;32m${successful}\x1b[0m OK / \x1b[1;31m${failure}\x1b[0m NOT OK`);
  console.log(`\x1b[1m${Math.round(time * 100) / 100}\x1b[0m seconds`);

  process.exit(0);
};

setInterval(() => time += 0.01, 107);

process.on("SIGINT", exit);

const db = new Database("projects.sqlite3");
db.run(`CREATE TABLE IF NOT EXISTS projects (
  id INTEGER NOT NULL,
  title STRING NOT NULL,
  description STRING NOT NULL,
  instructions STRING NOT NULL,
  comments_allowed BOOLEAN NOT NULL,
  author_id INTEGER NOT NULL,
  author_username STRING NOT NULL,
  author_scratch_team BOOLEAN NOT NULL,
  created STRING NOT NULL,
  modified STRING NOT NULL,
  shared STRING NOT NULL,
  views INTEGER NOT NULL,
  loves INTEGER NOT NULL,
  favorites INTEGER NOT NULL,
  remixes INTEGER NOT NULL,
  remix_parent INTEGER,
  remix_root INTEGER
)`);

while (!limit || currentID <= limit) {
  console.log(`\x1b[2m-\x1b[0m \x1b[1;34m${currentID}\x1b[0m`);
  console.log("  Fetching...");
  const res = await fetch(`https://api.scratch.mit.edu/projects/${currentID}`);
  if (res.ok) {
    console.log("  \x1b[1;32mOK\x1b[0m");
    successful++;
    const project = await res.json();
    console.log(`  ${project.title} by ${project.author.username}`);
    db.run("INSERT INTO projects (id, title, description, instructions, comments_allowed, author_id, author_username, author_scratch_team, created, modified, shared, views, loves, favorites, remixes, remix_parent, remix_root) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        project.id,
        project.title,
        project.description,
        project.instructions,
        project.comments_allowed,
        project.author.id,
        project.author.username,
        project.author.scratchteam,
        project.history.created,
        project.history.modified,
        project.history.shared,
        project.stats.views,
        project.stats.loves,
        project.stats.favorites,
        project.stats.remixes,
        project.remix.parent,
        project.remix.root
      ]
    );
  } else {
    console.log("  \x1b[1;31mNOT OK\x1b[0m");
    failure++;
  }
  currentID++;
}

exit();
