import { FC } from "react";
import { CopyBlock, dracula } from "react-code-blocks";

const Code: FC<{
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  codeBlock?: boolean;
}> = ({
  code,
  language = "Python",
  showLineNumbers = true,
  codeBlock = true,
}) => {
  const codeArray = code.split("\n").slice(1);
  let precedingLength = 0;
  for (var i = 0; i < codeArray[0].length; i++) {
    if (codeArray[0][i] === " ") {
      precedingLength++;
    } else {
      break;
    }
  }
  code = codeArray.map((line) => line.slice(precedingLength)).join("\n");

  return (
    <CopyBlock
      text={code}
      language={language}
      showLineNumbers={showLineNumbers}
      theme={dracula}
      codeBlock={codeBlock}
    />
  );
};

export default Code;
