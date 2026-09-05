# Gauss-Seidel Iterative Method
# Solves a 3x3 system of linear equations
# for 10 iterations.

print("=" * 50)
print("       GAUSS-SEIDEL ITERATIVE METHOD")
print("=" * 50)

print("\nEnter the coefficient matrix A (3x3):")

A = []
for i in range(3):
    row = list(map(float, input(f"Row {i + 1}: ").split()))

    if len(row) != 3:
        print("Error: Each row must contain exactly 3 values.")
        exit()

    A.append(row)

print("\nEnter the constant vector B:")
B = list(map(float, input("Enter 3 values separated by spaces: ").split()))

if len(B) != 3:
    print("Error: B must contain exactly 3 values.")
    exit()

print("\nEnter the initial guess:")
x = list(map(float, input("Enter x, y, z separated by spaces: ").split()))

if len(x) != 3:
    print("Error: Initial guess must contain exactly 3 values.")
    exit()

# Check diagonal elements
for i in range(3):
    if A[i][i] == 0:
        print("Error: Diagonal element cannot be zero.")
        print("Rearrange the equations before using Gauss-Seidel.")
        exit()

# Store iteration results
iterations = []

# Perform 10 iterations
for iteration in range(1, 11):

    # Gauss-Seidel calculations
    x[0] = (B[0] - A[0][1] * x[1] - A[0][2] * x[2]) / A[0][0]

    x[1] = (B[1] - A[1][0] * x[0] - A[1][2] * x[2]) / A[1][1]

    x[2] = (B[2] - A[2][0] * x[0] - A[2][1] * x[1]) / A[2][2]

    # Save current iteration
    iterations.append(x.copy())


# Display all 10 iterations
print("\n" + "=" * 55)
print("                  ITERATIONS")
print("=" * 55)

print(f"{'Iteration':<12}{'x':<15}{'y':<15}{'z':<15}")
print("-" * 55)

for i, values in enumerate(iterations, start=1):
    print(
        f"{i:<12}"
        f"{values[0]:<15.6f}"
        f"{values[1]:<15.6f}"
        f"{values[2]:<15.6f}"
    )

# Ask for a particular iteration
while True:
    try:
        selected = int(input("\nEnter the iteration number you want to see (1-10): "))

        if 1 <= selected <= 10:
            break
        else:
            print("Please enter a number between 1 and 10.")

    except ValueError:
        print("Please enter a valid integer.")

# Display selected iteration
result = iterations[selected - 1]

print("\n" + "=" * 45)
print(f"        RESULT OF ITERATION {selected}")
print("=" * 45)

print(f"x = {result[0]:.6f}")
print(f"y = {result[1]:.6f}")
print(f"z = {result[2]:.6f}")

print("=" * 45)
