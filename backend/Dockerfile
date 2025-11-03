# 1. Use an offical python base image
FROM python:3.12-slim

# 2. Set the working directory
WORKDIR /app

# 3. Install uv itself.
RUN pip install --no-cache-dir uv

# 4. Copy the project definition files to the container.
COPY pyproject.toml .
COPY uv.lock .

# 5. Install dependencies.
RUN uv pip install --system --no-cache-dir .

# 6. Copy the source code to the container.
COPY . .

# 7. Expose the port Cloud Run will use
EXPOSE 8080


# 8. Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]