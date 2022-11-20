import React, { useRef, useEffect, ReactElement, ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseOutlined } from "@ant-design/icons";
import Draggable from "react-draggable";
import { BoxResizer } from "@lucascv/box-resizer";
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  MAX_CHART_WIDTH,
  MIN_CHART_WIDTH,
  MIN_CHART_HEIGHT,
  MAX_CHART_HEIGHT,
  DEFAULT_LEFT,
  DEFAULT_TOP,
} from "./constants";
// import styles from "./index.module.less";
import "./index.css";

export interface IModalStyle {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  opacity?: number;
  backgroundColor?: string;
}

interface IProps {
  title: string | ReactNode;
  // 右侧插件区域
  plugin?: ReactElement;
  styleConfig?: IModalStyle;
  children: ReactElement;
  onclose: () => void;
  onZIndexChange: () => void;
  getFlexiModalDom: (domRef: HTMLDivElement) => void;
  parentNode?: ReactElement;
}

function FlexiModal(props: IProps) {
  // TODO parentNode待支持
  const { title, children, onclose, styleConfig, parentNode } = props;
  const modalStyleRef = useRef({
    width: (styleConfig && styleConfig.width) || DEFAULT_WIDTH,
    height: (styleConfig && styleConfig.height) || DEFAULT_HEIGHT,
    left: (styleConfig && styleConfig.left) || DEFAULT_LEFT,
    top: (styleConfig && styleConfig.top) || DEFAULT_TOP,
    initialLeft: (styleConfig && styleConfig.left) || DEFAULT_LEFT,
    initialTop: (styleConfig && styleConfig.top) || DEFAULT_TOP,
    // 背景透明度
    bgOpacity: (styleConfig && styleConfig.opacity) || 0.5,
  });
  const boxRef = useRef<HTMLDivElement | null>(null);
  // 模块全屏控制
  // const [isModalFull, setIsModalFull] = useState(false);

  // NOTE 如果已经存在 flexi-modal-portal 或指定父容器，则将后续新增的弹框加入这个容器即可
  let flexiModalPortalDOM = document.getElementById("flexi-modal-portal");
  if (!flexiModalPortalDOM) {
    flexiModalPortalDOM = document.createElement("div");
    flexiModalPortalDOM.setAttribute("id", "flexi-modal-portal");
    document.body.appendChild(flexiModalPortalDOM);
  }

  function handleClose() {
    onclose();
  }

  function handleModalChange(modalStyle: any) {
    modalStyleRef.current = {
      ...modalStyleRef.current,
      ...modalStyle,
    };
  }

  function handleDragStop(e: any, obj: any) {
    modalStyleRef.current = {
      ...modalStyleRef.current,
      // left: modalStyleRef.current.initialLeft + obj.x,
      // top: modalStyleRef.current.initialTop + obj.y,
    };
    // console.log(obj, modalStyleRef.current);
    // 将当前操作的弹框置于顶层
    props.onZIndexChange();
  }

  function handleZIndexChange() {
    // 将当前操作的弹框置于顶层
    props.onZIndexChange();
  }

  useEffect(() => {
    modalStyleRef.current = {
      ...modalStyleRef.current,
      // initialLeft: modalStyleRef.current.left,
      // initialTop: modalStyleRef.current.top,
    };
  }, [modalStyleRef.current.left, modalStyleRef.current.top]);

  // 将组件dom节点导出给父组件
  useEffect(() => {
    if (boxRef.current) {
      props.getFlexiModalDom && props.getFlexiModalDom(boxRef.current);
    }
  }, []);

  return createPortal(
    <Draggable
      handle=".flexi-modal-header"
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        className="flexi-container"
        ref={boxRef}
        style={{ ...modalStyleRef.current }}
        onClick={handleZIndexChange}
      >
        <BoxResizer
          boxRef={boxRef}
          config={{
            minHeight: MIN_CHART_HEIGHT,
            maxHeight: MAX_CHART_HEIGHT,
            minWidth: MIN_CHART_WIDTH,
            maxWidth: MAX_CHART_WIDTH,
          }}
          onChange={handleModalChange}
        />
        <header
          style={{
            backgroundColor: `rgba(102,102,102,${modalStyleRef.current.bgOpacity})`,
          }}
        >
          <span className="flexi-title">{title || "Default"}</span>
          <div
            style={{ flex: 1, height: "100%" }}
            className="flexi-modal-header"
            onClick={(e) => e.stopPropagation()}
          ></div>
          <div className="flexi-btns">
            {props.plugin}
            <CloseOutlined onClick={handleClose} />
          </div>
        </header>
        {children}
      </div>
    </Draggable>,
    flexiModalPortalDOM
  );
}

export default FlexiModal;
