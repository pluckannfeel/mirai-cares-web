// import { ReactComponent as EmptySvg } from "../assets/empty.svg";
import EmptySvg from "../assets/empty.svg?react";
import Result from "./Result";

type EmptyProps = {
  message?: string;
  title: string;
};

const Empty = ({ message, title }: EmptyProps) => {
  return <Result image={<EmptySvg />} subTitle={message} title={title} />;
};

export default Empty;
