# Use a lightweight base image with Deno installed
FROM denoland/deno:1.34.3
COPY ./src /app/src
WORKDIR /app

# Compile the Deno project
EXPOSE 8000/tcp
RUN deno cache /app/src/server.ts
# RUN deno task dev

# Specify the command to run when the container starts
# CMD ["deno", "run", "--watch", "--allow-env", "--allow-read", "--allow-net", "./server.ts"]
CMD ["deno", "task", "dev"]