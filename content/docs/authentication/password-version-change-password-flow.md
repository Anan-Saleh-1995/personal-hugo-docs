---
title: "Password version for change password flow"
description: "A clear explanation of how password_version helps log out old sessions after a password change."
summary: "A clear explanation of how password_version helps log out old sessions after a password change."
draft: false
weight: 10
params:
  display_toc: true
---

Use this when you want password change to do more than update the password itself.

It should also make older logged-in sessions stop working.

## The idea

`password_version` is a number attached to a user account.

When the password changes, that number goes up.

Every logged-in session also carries a copy of that number.

If a session still has the old number, it is treated as old and no longer trusted.

## The goal

Password change should mean more than:

- "the next login uses a new password"

It should also mean:

- "older logged-in sessions should stop working"

## Why this helps

Example:

- a user is logged in on their laptop
- they are also still logged in on an old phone
- they lose the phone and change their password from the laptop

Without `password_version`, the old phone may still stay logged in.

With `password_version`, the old phone becomes outdated and gets rejected on its next authenticated request.

## What "stale session" means

A stale session is just an old logged-in session.

It means:

- the account has moved to a newer password version
- this session is still carrying the older one

It does not mean:

- the account is broken
- the user can never log in again

It only means:

- this specific old session should no longer be trusted

## If the password changes but the version does not

Then old sessions still look valid.

That means:

- the user can log in with the new password
- old already-logged-in devices may still keep working

That is the problem `password_version` solves.

## If the version changes but the current session is not refreshed

Then the session that changed the password can invalidate itself.

That means:

- password change succeeds
- but the same browser may get logged out on the next request

So the correct behavior is:

- increase the stored version
- refresh the current good session with the new version
- reject older sessions still carrying the old version

## Small example

Start:

```txt
account password_version = 3

laptop session = 3
old phone session = 3
```

The user changes the password on the laptop.

After success:

```txt
account password_version = 4

laptop session = 4
old phone session = 3
```

Next time the old phone makes an authenticated request:

- account says `4`
- old phone says `3`
- mismatch
- session is rejected

That is how old sessions get logged out.

## Input and output

Typical input:

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

Typical successful output:

- the stored password hash is replaced
- `password_version` is incremented
- the current session gets the new version
- old sessions stay on the old version

## Step by step

In most systems the flow is:

1. validate the input
2. check that `confirmPassword` matches `newPassword`
3. check that the new password is not the same as the current one
4. verify the current password
5. hash and store the new password
6. increment `password_version`
7. refresh the current session with the new version
8. reject older sessions when they next try to use protected routes

## Mental model

Think of `password_version` like this:

- the account moves to a new password generation
- the current session is updated to that generation
- older sessions are left behind

That is why it helps protect users after a password change.
