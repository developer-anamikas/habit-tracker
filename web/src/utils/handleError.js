export function handleError(error, addToast, fallbackMessage = "Something went wrong") {
  console.error(error);

  addToast({
    message: error?.message || fallbackMessage,
    type: "error",
  });
}
