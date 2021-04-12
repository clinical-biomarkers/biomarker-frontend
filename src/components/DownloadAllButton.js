import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { downloadFromServer } from "../utils/download";
import FormControl from "@material-ui/core/FormControl";
// import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from "@material-ui/core/styles";
import Button from "react-bootstrap/Button";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Link } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import CloseIcon from "@material-ui/icons/Close";
import SelectControl from "./select/SelectControl";
import { getGlycanDownload } from "../data/glycan";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { getIdMappingDownloadAll } from "../data/mapping";

const DownloadAllButton = (props) => {
  const { types, dataId, itemType = "glycan" } = props;

  const [itemTypeResolver] = useState(() => {
    switch (itemType) {
      case "glycan":
        return getGlycanDownload;
      case "idMappingAll":
        return getIdMappingDownloadAll;

      default:
    }
    return null;
  });

  const [show, setShow] = useState(false);
  const [format, setFormat] = useState(props.format || props.types[0].type);
  // const [displayformat, setDisplayFormat] = useState(display);
  const [compressed, setCompressed] = useState(props.compressed || false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDownload = async () => {
    let dataType = types.find((typeItem) => typeItem.type === format).data;
    if (collapsed) dataType = "idmapping_list_all_collapsed";
    await downloadFromServer(dataId, format, compressed, dataType, itemTypeResolver);
    setShow(false);
  };
  const clearForm = () => {
    setFormat(props.format || props.types[0].type);
    setCompressed(props.compressed || false);
    setCollapsed(false);
  };
  const handleClickOutside = (event) => {
    setShow(false);
  };

  return (
    <div className="dropdown text-right">
      <Link>
        <button
          className="btn btn-link gg-download-btn dropdown-toggle"
          type="button"
          id="download"
          alt="Download results"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => {
            setShow(!show);
          }}
        >
          <GetAppIcon /> DOWNLOAD ALL
          <span className="caret mr-1"></span>
        </button>
      </Link>
      {show && (
        <>
          <ClickAwayListener onClickAway={handleClickOutside}>
            <div
              style={{ padding: "15px" }}
              className={"dropdown-menu dropdown-menu-right" + (show ? " open show" : "")}
              aria-labelledby="download"
            >
              <Row>
                <Col>
                  <button
                    type="button"
                    className="gg-blue-color"
                    style={{
                      float: "right",
                      border: "none",
                      backgroundColor: "inherit",
                      padding: "0",
                    }}
                    onClick={() => {
                      clearForm();
                      setShow(!show);
                    }}
                  >
                    <CloseIcon />
                  </button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormControl margin="dense" variant="outlined" fullWidth>
                    <Row>
                      <Col xs={3} sm={3} style={{ paddingTop: "6px" }}>
                        <strong>Format:</strong>
                      </Col>

                      <Col
                        xs={9}
                        sm={9}
                        // align="right !important"
                        className="text-right"
                      >
                        <SelectControl
                          fullWidth
                          inputValue={format}
                          menu={types.map((typeItem) => {
                            return { id: typeItem.type, name: typeItem.display };
                          })}
                          setInputValue={(value) => {
                            setFormat(value);
                          }}
                        />
                      </Col>
                    </Row>
                  </FormControl>
                </Col>
              </Row>
              <Row style={{ paddingTop: "10px" }}>
                <Col>
                  <strong style={{ whiteSpace: "nowrap" }}>Compress file (*.gzip):</strong>
                </Col>
                <Col
                  // xs={ 5 } sm={ 5 }
                  align="right"
                >
                  <input
                    // style={{ fontSize: 'xx-large' }}
                    type="checkbox"
                    id="download_compression"
                    checked={compressed}
                    onClick={(e) => {
                      setCompressed(e.target.checked);
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ paddingTop: "10px" }}>
                <Col>
                  <strong style={{ whiteSpace: "nowrap" }}>Collapse 1:n mapping:</strong>
                </Col>
                <Col align="right">
                  <input
                    type="checkbox"
                    checked={collapsed}
                    onClick={(e) => {
                      setCollapsed(e.target.checked);
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    type="button"
                    style={{ marginTop: "15px", float: "right" }}
                    className="gg-btn-outline"
                    onClick={handleDownload}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </ClickAwayListener>
        </>
      )}
    </div>
  );
};
export default DownloadAllButton;
