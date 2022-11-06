export default function Form({ fullWidth = true, children, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      style={{ width: fullWidth && '85%' }}
    >
      {children}
    </form>
  );
}
