import React, { useState, useEffect } from "react";
import { Tag } from "antd";
// import styles from "./index.module.less";
import "./index.css";

const { CheckableTag } = Tag;

interface IProps {
  tags: string[];
  defaultValue?: string[];
  onChange?: (selectedTags: string[], tags: string[]) => {};
}

function isSameStrArray(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (!arr2.some((item) => item === arr1[i])) {
      return false;
    }
  }
  return true;
}

export default function TagSelector(props: IProps) {
  const { tags = [], defaultValue = [] } = props;
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  useEffect(() => {
    if (defaultValue.length > 0) {
      setSelectedTags(defaultValue);
      if (isSameStrArray(tags, defaultValue)) {
        setIsSelectAll(true);
      }
    }
  }, []);

  function handleTagSelect(tag: string, checked: boolean) {
    const newSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((item) => item !== tag);
    // 取消或恢复全选
    if (isSameStrArray(tags, newSelectedTags)) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
    setSelectedTags(newSelectedTags);
    props.onChange && props.onChange(selectedTags, tags);
  }

  function handleAllTagSelect() {
    const newState = !isSelectAll;
    setSelectedTags(newState ? tags : []);
    setIsSelectAll(newState);
  }

  return (
    <div className="tag-selector-container">
      <CheckableTag checked={isSelectAll} onChange={() => handleAllTagSelect()}>
        全选
      </CheckableTag>
      {tags.map((tag) => {
        return (
          <CheckableTag
            key={tag}
            checked={selectedTags.indexOf(tag) > -1}
            onChange={(checked) => handleTagSelect(tag, checked)}
          >
            {tag}
          </CheckableTag>
        );
      })}
    </div>
  );
}
