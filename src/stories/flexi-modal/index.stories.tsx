import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import FlexiModal from ".";

export default {
  title: "Example/FlexiModal",
  component: FlexiModal,
  argTypes: {},
} as ComponentMeta<typeof FlexiModal>;

const Template: ComponentStory<typeof FlexiModal> = (args) => (
  <FlexiModal {...args} />
);

export const Index = Template.bind({});
Index.args = {
  title: "Default",
  onclose: () => {
    console.log("close modal");
  },
  styleConfig: {
    left: 40,
    top: 40,
  },
};
