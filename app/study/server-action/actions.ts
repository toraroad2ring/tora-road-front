"use server";

export async function echoMessage(
  message: string
) {
  console.log(
    "Server Action received:",
    message
  );

  return {
    message:
      `Server received: ${message}`,

    timestamp:
      new Date().toISOString(),
  };
}