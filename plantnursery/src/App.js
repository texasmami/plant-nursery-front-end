import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Plant from "./components/Plant";
import New from "./components/NewPlant";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./components/About";
import LoginForm from "./components/login";
import NewUserForm from "./components/newuser";
import Filter from './components/filter'
// import EditPlant from "./components/EditPlant";

function App() {
  // HOOKS
  const [plants, setPlants] = useState([]);
  const [showPlants, setShowPlants] = useState(true);
  const [showMessage, setShowMessage] = useState(false);


  
  const handleShowPlants = () => {
    getPlants()
    setShowPlants(true);
    setShowMessage(false)
  }


  const getPlants = () => {
    axios
      .get("https://ancient-lowlands-69118.herokuapp.com/plantnursery")
      .then((response) => {
        setPlants(response.data);
      });
  };

 
  const [toggleError, setToggleError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toggleLogout, setToggleLogout] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
 

  const handleLogout = () => {
    console.log("......");
    setCurrentUser({});
    handleToggleLogout();
  };


  const handleToggleLogout = () => {
    if (toggleLogout) {
      setToggleLogout(false);
    } else {
      setToggleLogout(true);
    }
  };
  useEffect(() => {
    getPlants();
  }, []);

  return (
    <Router>
      <div>
        <div className="demo-wrap"></div>
        <div className="header">
          {/* empty div for spacing */}
          <div></div>
          <div>
            <h1>
              Plants Parad<i className="bi bi-tree"></i>se
            </h1>
          </div>
          <div>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              {!currentUser.username ? (
                <Link to="/login">Log In</Link>
              ) : (
                <Link onClick={handleLogout}>Log out</Link>
              )}
            </nav>
          </div>
        </div>
        <Routes>
          <Route
            path="/login"
            element={
              <LoginForm
                toggleError={toggleError}
                errorMessage={errorMessage}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/createaccount"
            element={
              <NewUserForm
                toggleError={toggleError}
                setToggleError={setToggleError}
                setCurrentUser={setCurrentUser}
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/"
            element={
              <>
                <div className="buttons-container">
                  <button
                    onClick={handleShowPlants}
                  >
                    Show All Plants
                  </button>
                  {/* IF LOGGED IN, CAN ADD NEW PLANT */}
                  {currentUser.username ? (
                    <button
                      onClick={() => {
                        setShowPlants(false);
                      }}
                    >
                      Add New Plant Listing
                    </button>
                  ) : null}
                  <Filter setPlants={setPlants} getPlants={getPlants} setShowMessage={setShowMessage}/>
                </div>
                {showPlants ? (
                  <div className="plants-container">
                    {plants.map((plant, index) => {
                      return (
                        <Plant
                          plant={plant}
                          getPlants={getPlants}
                          currentUser={currentUser}
                          key={index}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <>
                    <section id="new-listing">
                      <h2>Add New Plant Listing</h2>
                    </section>
                    <New getPlants={getPlants} setShowPlants={setShowPlants} />
                  </>
                )}
              </>
            }
          />
        </Routes>
      </div>
      {showMessage?
        <section className="emptysearch">
            Oops! It looks like this section is empty! Check back later for more.
        </section>
            :
            null
        }
    </Router>
  );
}

export default App;
