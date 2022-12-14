import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Image,
  Progress,
  Heading,
} from "@chakra-ui/react";

const TokenCard = ({
  title,
  subTitle,
  jp,
  maxJp,
  imageURI,
  bgColor,
  showFooter,
  footerLabel,
  footerText,
}) => {
  return (
    <Card
      backgroundColor={bgColor ?? "pink.400"}
      color={"white"}
      w={"250px"}
      minH={"350px"}
      borderRadius={"12px"}
    >
      <CardHeader p={1} fontSize={"1.3rem"} fontWeight={"bold"}>
        <Heading size="lg">{title}</Heading>
        {subTitle ? <Text>{subTitle}</Text> : ""}
      </CardHeader>
      <CardBody px={2} py={1}>
        <Image alt="" src={imageURI} borderRadius={"6px"} />
        <Progress
          mt={2}
          borderRadius={"6px"}
          max={maxJp}
          value={jp}
          colorScheme={"green"}
          bg={"red.400"}
          h={"20px"}
        />
        <Text fontSize={"0.7rem"} py={0}>
          {jp} / {maxJp} Joy Points
        </Text>
      </CardBody>
      {showFooter ? (
        <CardFooter flexDir={"column"}>
          <Text>{footerLabel}</Text>
          <Text>{footerText}</Text>
        </CardFooter>
      ) : (
        ""
      )}
    </Card>
  );
};

export default TokenCard;
