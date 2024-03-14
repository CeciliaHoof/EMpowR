import LoginForm from "../components/LoginForm";
import styled from "styled-components";

function Login() {
  return (
    <>
      <Header>
        <h1 style={{ marginBottom: "1vh" }}>
          Welcome to HealthSync, your new at home Electronic Medical Record.
        </h1>
        <h2>Create an Account or Login below to get started.</h2>
      </Header>
      <MainContainer>
        <MessageContainer>
          <p style={{ fontSize: "2vh" }}>
            HealthSync allows you to save all of your prescription medications
            in one place, record what time you take these medications, record
            your vital signs and keep track of any symptoms you experience.
          </p>
          <p style={{ fontSize: "2vh" }}>
            By creating this log, you will have a fantastic record to take with
            you to your next followup appointment!
          </p>
        </MessageContainer>
        <FormContainer>
          <LoginForm />
        </FormContainer>
      </MainContainer>
    </>
  );
}

export default Login;

const Header = styled.header`
  height: 20%;
  background-color: #7e93a8;
  text-align: center;
  padding: 1vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const MainContainer = styled.div`
  display: flex;
  width: 100vw;
  gap: 10vw;
  margin-top: 5vh;
`;
const MessageContainer = styled.div`
  width: 55%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10%;
`;
const FormContainer = styled.div`
  padding: 1vh;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #b6cbe0;
`;
