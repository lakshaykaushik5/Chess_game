import { useNavigate } from "react-router-dom";
import img_chessboard from "../../public/images/phphK5JVu.png";
import { Button } from "../components/button";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center">
        <div className="pt-8 max-w-screen-m">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex justify-center">
              <img className="max-w-96" src={img_chessboard} />
            </div>
            <div className="pt-16">
              <div className="flex justify-center">
                <h1 className="text-4xl font-bold text-white">
                  {" "}
                  Play Chess Online on #3 Website !{" "}
                </h1>{" "}
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={() => {
                    navigate("/Game");
                  }}
                >
                  Play Online
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
