Git Interview Notes

The 20 Git commands developers use daily, written as interview questions. Each question: short answer → real-life example → command → ⚠️ gotcha → 🎯 interview tip.

Table of Contents
Part	Topic	Questions
A	Repository	GIT-1 to GIT-4
B	Branching	GIT-5 to GIT-7
C	Commit	GIT-8 to GIT-10
D	Remote	GIT-11 to GIT-14
E	Merge	GIT-15 to GIT-17
F	Undo	GIT-18 to GIT-21
G	Stash	GIT-22 to GIT-24
H	Revision	GIT-25 to GIT-26
Part A — Repository
GIT-1. What does git init do?

Creates a new Git repository in the current folder (adds a hidden .git folder).

Real-life: opening a new diary to start recording every change.

bash
mkdir my-app && cd my-app
git init

⚠️ Deleting the .git folder deletes the entire history.

GIT-2. What does git clone do?

Copies a remote repository to your machine, with full history, and sets it up as origin.

Real-life: photocopying a whole book, including every earlier edition.

bash
git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git my-folder  # custom folder name
GIT-3. What does git status show?

Which files are changed, staged or untracked, and which branch you're on.

Real-life: checking your shopping trolley before going to the till.

bash
git status
git status -s   # short version

🎯 Run it before every add, commit and push; it prevents most mistakes.

GIT-4. What are the three areas of Git? ⭐
text
Working Directory  →  Staging Area  →  Repository (commits)
   (edit files)       (git add)        (git commit)

Real-life: writing a letter (working directory) → putting it in the envelope (staging) → posting it (commit).

🎯 The most common Git interview question. Every command moves changes between these areas.

Part B — Branching
GIT-5. How do you list branches?
bash
git branch       # local branches (* = current)
git branch -a    # local + remote
git branch -r    # remote only

Real-life: looking at all the roads leading off a roundabout.

GIT-6. How do you create a branch?
bash
git branch feature/login          # create only (stay on current branch)
git switch -c feature/login       # create AND switch (modern)
git checkout -b feature/login     # create AND switch (classic)

Real-life: making a copy of a document to try changes without touching the original.

🎯 Name branches clearly: feature/login, fix/cart-total, hotfix/payment.

GIT-7. git checkout vs git switch?
bash
git checkout main   # switch branch (old way)
git switch main     # switch branch (modern, clearer)
checkout	switch / restore
does many jobs (branches and files)	switch = branches, restore = files
easy to misuse	clearer, safer

Real-life: checkout = a Swiss Army knife. switch and restore = one tool per job.

⚠️ Uncommitted changes that would conflict block the switch; commit or stash first (GIT-22).

Part C — Commit
GIT-8. What does git add <file> do?

Moves changes from the working directory to the staging area.

Real-life: choosing which items go into the parcel.

bash
git add index.js
git add src/          # a whole folder
git add -p            # pick changes piece by piece (great for clean commits)
GIT-9. What does git add . do?

Stages all changes in the current folder and below.

bash
git add .

⚠️ Easy to commit secrets (.env), logs or node_modules. Use a .gitignore and check git status first.

Real-life: sweeping everything on the desk into the parcel, including your keys.

GIT-10. What does git commit -m do?

Saves staged changes as a snapshot with a message.

Real-life: taking a dated photo of your work so you can always go back to it.

bash
git commit -m "fix: correct cart total when coupon applied"
git commit --amend -m "better message"   # fix the last commit (before pushing)

Good message: short summary of what and why, in the imperative: add login rate limit, not changes or fixed stuff.

🎯 Conventional commits: feat:, fix:, docs:, refactor:, test:, chore:.

⚠️ Don't --amend commits already pushed to a shared branch.

Part D — Remote
GIT-11. What does git remote -v show?

The remote repositories and their URLs (fetch + push).

bash
git remote -v
# origin  https://github.com/user/repo.git (fetch)
# origin  https://github.com/user/repo.git (push)

git remote add origin https://github.com/user/repo.git   # connect a local repo

Real-life: your phone's contact list for where to send and receive code.

🎯 origin = your remote copy. upstream = usually the original repo you forked from.

GIT-12. What does git push do?

Uploads your local commits to the remote branch.

Real-life: uploading photos from your phone to the cloud.

bash
git push origin feature/login
git push -u origin feature/login   # first push: set upstream, then just "git push"

⚠️ Rejected push = the remote has commits you don't have. Pull first, don't force. ⚠️ Never git push --force on shared branches. If you must, use --force-with-lease (refuses if someone else pushed).

GIT-13. What does git pull do?

Downloads remote changes and merges them into your branch.

text
git pull = git fetch + git merge

Real-life: downloading the latest version of a shared document and combining it with your edits.

bash
git pull origin main
git pull --rebase origin main   # replay your commits on top (cleaner history)

🎯 Pull often to get small, easy conflicts instead of one big one.

GIT-14. git fetch vs git pull?
git fetch	git pull
downloads changes only	downloads and merges
safe, your files unchanged	updates your branch
look before you leap	do it now

Real-life: fetch = checking your post. Pull = opening it and filing it straight away.

bash
git fetch origin
git log main..origin/main   # see what's new before merging
Part E — Merge
GIT-15. What does git merge do?

Combines another branch into your current branch.

Real-life: two people edited copies of a document; merge puts both sets of edits into one.

bash
git switch main
git merge feature/login
Type	When
Fast-forward	main had no new commits, so it just moves forward
Merge commit	both branches changed; Git creates a commit joining them
GIT-16. How do you handle merge conflicts? git merge --abort?

A conflict happens when both branches changed the same lines.

text
<<<<<<< HEAD
const total = price * qty;
=======
const total = price * qty - discount;
>>>>>>> feature/discount

Fix: edit the file, remove the markers, keep the right code, then:

bash
git add cart.js
git commit

Give up and go back:

bash
git merge --abort   # returns to the state before the merge

Real-life: two people wrote different words on the same line; someone has to decide which stays.

🎯 Talk to the other author when unsure; don't just pick "mine".

GIT-17. git merge vs git rebase?
Merge	Rebase
keeps history as it happened	rewrites your commits on top of the target
adds a merge commit	straight, linear history
safe on shared branches	only on your own branches

Real-life: merge = two roads joining at a junction. Rebase = moving your road so it starts at the end of the other one.

bash
git switch feature/login
git rebase main   # replay my commits on top of latest main

⚠️ Golden rule: never rebase commits others have already pulled.

Part F — Undo
GIT-18. What does git restore do?

Discards changes to a file in the working directory.

bash
git restore index.js            # discard unstaged changes ⚠️ lost forever
git restore --staged index.js   # unstage, keep changes in the file

Real-life: pressing "revert to saved" in a document editor.

⚠️ Uncommitted changes discarded with restore can't be recovered.

GIT-19. What does git reset --soft HEAD~1 do?

Undoes the last commit but keeps its changes staged.

Real-life: taking a letter back out of the postbox; it's still in the envelope.

bash
git reset --soft HEAD~1
# fix things, then commit again

🎯 Use it to redo a commit message or combine changes.

GIT-20. What does git reset --hard HEAD~1 do?

Undoes the last commit and deletes its changes and any uncommitted work.

Real-life: shredding the letter.

bash
git reset --hard HEAD~1
Mode	Commit	Staging	Files
--soft	undone	changes kept staged	kept
--mixed (default)	undone	unstaged	kept
--hard	undone	cleared	deleted

⚠️ Dangerous. Recover a lost commit with git reflog → git reset --hard <hash>. Uncommitted work is gone for good.

GIT-21. git reset vs git revert? ⭐
reset	revert
moves the branch back, removes commits	adds a new commit that undoes changes
rewrites history	keeps history
local / unpushed work	shared / pushed branches

Real-life: reset = tearing pages out of a book. Revert = adding a correction page.

bash
git revert abc123   # safe undo on main

🎯 "Pushed already? Use revert. Only on my machine? reset is fine."

Part G — Stash
GIT-22. What does git stash do?

Saves uncommitted changes and cleans your working directory.

Real-life: putting half-finished work in a drawer to deal with an urgent call.

bash
git stash
git stash push -m "wip: login form"   # with a name
git stash -u                          # include untracked files

🎯 Typical use: urgent bug on main while you're mid-feature → stash → switch → fix → come back.

GIT-23. What does git stash list show?

All saved stashes, newest first.

bash
git stash list
# stash@{0}: On feature/login: wip: login form
# stash@{1}: WIP on main: 3f2a1b fix header

Real-life: labels on the drawers.

GIT-24. git stash pop vs git stash apply?
pop	apply
applies and removes the stash	applies, keeps the stash
normal use	apply the same changes to several branches
bash
git stash pop             # latest
git stash apply stash@{1} # a specific one
git stash drop stash@{1}  # delete one

Real-life: pop = taking work out of the drawer. Apply = photocopying it and leaving the original inside.

⚠️ If pop hits a conflict, the stash is not removed; fix it, then git stash drop.

Part H — Revision
GIT-25. What's a typical daily workflow?
bash
git switch main
git pull origin main                 # 1. get latest
git switch -c feature/login          # 2. new branch
# ...code...
git status                           # 3. check
git add .                            # 4. stage
git commit -m "feat: add login form" # 5. commit
git pull --rebase origin main        # 6. stay up to date
git push -u origin feature/login     # 7. push
# 8. open a Pull Request → review → merge

Real-life: check out the newest draft, work on your own copy, save often, sync, hand it in for review.

GIT-26. Quick interview answers
Question	Answer
3 areas of Git?	working directory → staging → repository
fetch vs pull?	download only vs download + merge
merge vs rebase?	keeps history + merge commit vs linear rewritten history
reset vs revert?	removes commits (local) vs new undo commit (shared)
--soft / --mixed / --hard?	keep staged / keep unstaged / delete
checkout vs switch?	old multi-tool vs branch-only command
stash pop vs apply?	apply + remove vs apply + keep
Merge conflict?	same lines changed; edit, add, commit or --abort
Recover a lost commit?	git reflog
Safe force push?	--force-with-lease
Undo staging?	git restore --staged <file>
Fix last commit message?	git commit --amend (only if not pushed)
#	Command	Purpose
01	git init	start a repo
02	git clone <url>	copy a remote repo
03	git status	see changes
04	git branch	list branches
05	git branch <name>	create a branch
06	git checkout <name> / git switch <name>	change branch
07	git add <file>	stage a file
08	git add .	stage everything
09	git commit -m "msg"	save a snapshot
10	git remote -v	show remotes
11	git push origin <branch>	upload commits
12	git pull origin <branch>	download + merge
13	git merge <branch>	combine branches
14	git merge --abort	cancel a merge
15	git restore <file>	discard file changes
16	git reset --soft HEAD~1	undo commit, keep staged
17	git reset --hard HEAD~1	undo commit, delete changes
18	git stash	save work for later
19	git stash list	list stashes
20	git stash pop	restore + remove stash

Pro tip: write meaningful commit messages, pull often, and never rewrite history on shared branches.
