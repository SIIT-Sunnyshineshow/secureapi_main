function Home() {
  return (
    <div>
      <input
        type="button"
        value="Login"
        onClick={() => {
          window.location.href = "/login";
        }}
      />
      <input
        type="button"
        value="Register"
        onClick={() => {
          window.location.href = "/Register";
        }}
      />
    </div>
  );
}

export default Home;
