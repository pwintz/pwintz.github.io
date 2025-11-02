---
layout: single
title: "Check All Your Git Repositories for Uncommitted Changes"
excerpt: "Avoid losing work: How to check the status of all Git repositories in bulk."
toc: 1
tags: git
date: 2025-11-01 00:00:00 -0800
# comments:
#    host: mathstodon.xyz
#    username: pwintz
#    id: 112738148972158290
---

When you have many Git repositories, it is easy to overlook some and forget to commit or push all of your recent changes. 
Recently, I found this out the hard way when my computer crashed a week before my PhD defense. Most of my work was backed up recently to GitHub, but my work was spread across ten or so repositories and some hadn't been pushed in months!

I eventually recovered all my data, but once my defense was over, I developed the following solution for checking the status of all of the repos on my system quickly. 

My approach uses Bash, which I have tested on Ubuntu. If you install Git-Bash for Windows, everything _should_ work fine, but you may need to make some adjustments to file paths, including where the Git configuration file is located.

## 1. Create a list of all of the Git repositories
Create a list of all of the repositories that you want to track the status of. 
In Bash, you can use `find` to search your user directory:
```
find . -type d -name .git
```
Add the list to `~/.gitconfig` in the following format:
```
# ╭───────────────────────────────────────────────╮
# │             List all repositories             │
# ╰───────────────────────────────────────────────╯
# List all Git repositories on this machine. This allows print the status of all repositories using git check-all, which, in turn, calls git_all_status.sh'
[allRepos]
  # ⋘──────── Code directories ────────⋙
  repo = /path/to/repo_1
  repo = /path/to/repo_2
  repo = /path/to/repo_3
  repo = /path/to/repo_4
  repo = /path/to/repo_5
  repo = /path/to/repo_6
```
Note; Each path should be to the parent directory of the `.git/` directory.
This list can contain directories that are not Git repositories but should be, so that you are warned that **none** of the code has been committed.

You can check the contents of your list using 
```bash
git config get --all allRepos.repo
```

## 2. Script for checking 

Copy the following script onto your system at (for example), `~/scripts/git_all_status.sh`.
You may need to make it executable using `chmod +x git_all_status.sh`.
From the directory containing `git_all_status.sh`, you can run it, now, and it should produce a list of all of the Git repositories you listed:
```bash
$ ./git_all_status.sh
```
Output:
```plaintext
 Uncommitted changes: /path/to/repo_1
 Uncommitted changes: /path/to/repo_3
 Uncommitted changes: /path/to/repo_4
Not a Git repository: /path/to/repo_5
    Unpushed commits: /path/to/repo_6
```
If repository is not listed, then changes have been committed and pushed.

Here is the `git_all_status.sh` script:
```bash
#!/usr/bin/env bash

# ╭─────────────────────────────────────────────────╮
# │             Git Status of All Repos             │
# ╰─────────────────────────────────────────────────╯

echo "Checking each Git repo that is listed in allRepos.repo."
echo "To see the entire list, run 'git config get --all allRepos.repo'."
echo "To modify the list, edit '~/.gitconfig'"
echo

# Add each directory that is a Git repository on your system to ".gitconfig" under 
repo_paths="$(git config get --all allRepos.repo)"
repo_paths_array=($repo_paths)

for repo_dir in "${repo_paths_array[@]}"
do
  # Run within a subshell, so that changing directory does not persist.
  (
    cd $repo_dir
    git_status_out=$(git status --porcelain 2> /dev/null)
    git_status_exit_status=$?

    # Based on https://stackoverflow.com/a/48180899/6651650
    git_unpushed_branches=$(git log --branches --not --remotes --no-walk  --oneline 2> /dev/null)

    if [[ $git_status_exit_status -eq 128 ]]; then # Error 128: Not a Git directory.
      echo "Not a Git repository: $repo_dir"
    elif [[ $git_status_exit_status -ne 0 ]]; then # Unknown error (non-zero exit code).
      # Failed
      echo "Unexpected error code  $git_status_exit_status from `gitstatus` in $repo_dir."
    elif [[ -n "$git_status_out" ]]; then # If status is non-empty.
      # Failed 
      echo " Uncommitted changes: $repo_dir"
      # For debugging, it may be useful to print the status.
      # echo $git_status_out
    elif [[ -n "$git_unpushed_branches" ]]; then 
      # If the unpushed branches output is nonempty.
      echo "    Unpushed commits: $repo_dir"
    fi
  )
done
echo
echo 'Finished.'
```

## 3. Configure a Git Alias

You can configure a Git alias `check-all` to execute `git_all_status.sh` similar to other Git commands (e.g., `git push` and `git add`):
``` 
git check-all
```
To do this, modify `~/.gitconfig` to contain
```
# ╭──────────────────────────────────────────────╮
# │  ╭────────────────────────────────────────╮  │
# │  │             Define Aliases             │  │
# │  ╰────────────────────────────────────────╯  │
# ╰──────────────────────────────────────────────╯
[alias]
  check-all = !~/scripts/git_all_status.sh
```
The `!` before `~/scripts/git_all_status.sh` indicates that it should be run as a shell script.

<!-- 
## 4. To-do: Scheduled Checks

Eventually, I would like to configure my system automatically run `git check-all` periodic schedule, with an alert shown whenever there are uncommitted or unpushed changes. 
This is not something I have worked on yet. If you find a good soltution, let me know!  -->