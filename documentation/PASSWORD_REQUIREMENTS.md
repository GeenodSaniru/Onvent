# Password Requirements for User Registration

When registering a new user in the Onvent application, passwords must meet the following requirements:

## Password Validation Rules

1. **Minimum Length**: At least 8 characters long
2. **Uppercase Letter**: Must contain at least one uppercase letter (A-Z)
3. **Lowercase Letter**: Must contain at least one lowercase letter (a-z)
4. **Digit**: Must contain at least one digit (0-9)

## Examples

### Valid Passwords
- `Password123` ✓
- `MySecurePass1` ✓
- `TestUser123` ✓

### Invalid Passwords
- `password` ❌ (missing uppercase letter and digit)
- `PASSWORD123` ❌ (missing lowercase letter)
- `Password` ❌ (missing digit)
- `Pass1` ❌ (too short - less than 8 characters)

## Error Messages

When a password doesn't meet the requirements, the system will return specific error messages:

- "Password must be at least 8 characters long"
- "Password must contain at least one uppercase letter"
- "Password must contain at least one lowercase letter"
- "Password must contain at least one digit"

## Duplicate Validation

The system also checks for duplicate usernames and emails:

- "Username is already taken"
- "Email is already in use"

These validation rules ensure that user accounts are secure and that each user has a unique identity in the system.