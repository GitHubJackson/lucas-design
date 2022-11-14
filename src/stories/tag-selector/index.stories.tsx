import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TagSelector from ".";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/TagSelector",
  component: TagSelector,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // defaultValue: { control: "color" },
    // tags: { control: "color" },
  },
} as ComponentMeta<typeof TagSelector>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TagSelector> = (args) => (
  <TagSelector {...args} />
);

export const Index = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Index.args = {
  defaultValue: ["tag1"],
  tags: ["tag1", "tag2"],
};
