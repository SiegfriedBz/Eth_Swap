export const spinner = (color) => {
  const myClass = () => {
    return color === "white" ? "text-light" : "text-primary"
  }
  return (
    <>
      <div
        className={`spinner-grow spinner-grow-sm ${myClass()}`}
        role='status'
      ></div>
      <div
        className={`spinner-grow spinner-grow-sm ${myClass()}`}
        role='status'
      ></div>
      <div
        className={`spinner-grow spinner-grow-sm ${myClass()}`}
        role='status'
      ></div>
    </>
  )
}
