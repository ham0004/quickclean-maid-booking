---
description: Git workflow with branch and commit naming conventions for features
---

# Git Workflow - CSE470 Version Control Guidelines

## Branch Naming: `<category>/<description>`
**Categories:** feature, bugfix, test  
**Description:** kebab-case (lowercase with hyphens)

**Examples:**
```bash
git checkout -b feature/email-verification
git checkout -b feature/admin-category-management
git checkout -b feature/booking-system
```

## Commit Messages: `<type>: <description>`
**Types:** feat, fix, refactor, chore  
**Rules:** lowercase, no dot at end, think "This commit will <do this>"

**Examples:**
```bash
git commit -m "feat: add email verification endpoint"
git commit -m "fix: add missing parameter to service call"
git commit -m "refactor: simplify booking validation logic"
git commit -m "chore: update README with new endpoints"
```

## Feature Branch Workflow

### 1. Start New Feature
```bash
git checkout main
git pull origin main
git checkout -b feature/<name>
```

### 2. Work with Frequent Commits
```bash
# After each logical unit of work
git add .
git commit -m "<type>: <description>"
```

**Commit after:**
- Each endpoint implementation
- Each component creation
- Each sub-task from checklist
- Each bug fix

### 3. Push Feature Branch
```bash
git push origin feature/<name>
```

### 4. Create Pull Request on GitHub
- Review changes
- Merge PR
- Delete remote branch

### 5. Update Local Main
```bash
git checkout main
git pull origin main
git branch -d feature/<name>
```

### 6. Repeat for Next Feature
```bash
git checkout -b feature/<next-name>
```

## Sprint 4 Features

1. **feature/email-verification** - Email verification & account restrictions
2. **feature/admin-category-management** - Service category CRUD
3. **feature/maid-approval-system** - Maid profile & approval workflow
4. **feature/booking-system** - Complete booking functionality

## Rules
✅ Branch from updated main  
✅ Commit frequently with proper messages  
✅ Push only when feature is complete  
✅ Create PR, merge, then pull to main  
✅ Delete branch after merge
