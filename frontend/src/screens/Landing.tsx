import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <button
        onClick={() => navigate("/game")}
        className="bg-green-500 rounded-lg p-4 text-white hover:bg-green-600"
      >
        Join Room
      </button>
    </div>
  );
}

export default Landing;
