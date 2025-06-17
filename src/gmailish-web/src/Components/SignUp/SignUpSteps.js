import StepOneItem from "./StepOneItem";
import StepTwoItem from "./StepTwoItem";
import StepThreeItem from "./StepThreeItem";

const SignUpSteps = (props) => {
  const {
    step, firstName, setFirstName, lastName, setLastName, birthDate, setBirthDate,
    gender, setGender, mail, setMail, password, setPassword, image, setImage
  } = props;

  if (step === 1) {
    return <StepOneItem {...{ firstName, setFirstName, lastName, setLastName, birthDate, setBirthDate, gender, setGender }} />;
  }
  if (step === 2) {
    return <StepTwoItem {...{ mail, setMail, password, setPassword }} />;
  }
  if (step === 3) {
    return <StepThreeItem {...{ image, setImage }} />;
  }
  return null;
};

export default SignUpSteps;