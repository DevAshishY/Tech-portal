# 20 Git Commands Every Developer Uses Daily

Your daily Git cheat sheet for faster, smarter development.

---

## 1. Repository

| # | Command | Purpose |
|---|---|---|
| 01 | `git init` | Initialize a new Git repository |
| 02 | `git clone <repo-url>` | Clone a remote repository locally |
| 03 | `git status` | Check the status of changes in your working directory |

---

## 2. Branching

| # | Command | Purpose |
|---|---|---|
| 04 | `git branch` | List all branches in the repository |
| 05 | `git branch <branch-name>` | Create a new branch |
| 06 | `git checkout <branch-name>` | Switch to another branch |

---

## 3. Commit

| # | Command | Purpose |
|---|---|---|
| 07 | `git add <file>` | Stage changes for commit |
| 08 | `git add .` | Stage all changes |
| 09 | `git commit -m "message"` | Commit staged changes with a message |

---

## 4. Remote

| # | Command | Purpose |
|---|---|---|
| 10 | `git remote -v` | Show remote repositories |
| 11 | `git push origin <branch>` | Push changes to remote repository |
| 12 | `git pull origin <branch>` | Fetch and merge changes from remote |

---

## 5. Merge

| # | Command | Purpose |
|---|---|---|
| 13 | `git merge <branch-name>` | Merge specified branch into current branch |
| 14 | `git merge --abort` | Abort a merge in progress |

---

## 6. Undo

| # | Command | Purpose |
|---|---|---|
| 15 | `git restore <file>` | Discard changes in working directory |
| 16 | `git reset --soft HEAD~1` | Undo last commit, keep changes staged |
| 17 | `git reset --hard HEAD~1` | Undo last commit, discard all changes |

---

## 7. Stash

| # | Command | Purpose |
|---|---|---|
| 18 | `git stash` | Stash current changes |
| 19 | `git stash list` | List all stashed changes |
| 20 | `git stash pop` | Apply and remove the latest stash |

---

**Pro Tip:** Use meaningful commit messages and pull often to keep your codebase clean and collaboration smooth.
