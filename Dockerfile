# Use a lightweight base image with Deno installed
FROM denoland/deno:1.34.3
COPY ./src /src
WORKDIR /src

# Compile the Deno project
EXPOSE 8000/tcp
RUN deno cache ./server.ts
RUN deno compile --allow-env --allow-read --allow-net ./server.ts

# Specify the command to run when the container starts
CMD ["deno", "run", "--watch", "--allow-env", "--allow-read", "--allow-net", "./server.ts"]