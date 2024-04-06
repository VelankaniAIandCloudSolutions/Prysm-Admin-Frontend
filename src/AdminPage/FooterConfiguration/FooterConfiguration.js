import React, { useEffect, useState } from "react";
import "./FooterConfiguration.css";
import { getCrudApi, postCrudApi } from "../../webServices/webServices";
import Error from "../../Error/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../Loading/Loading";

export default function FooterConfiguration() {
  const [AddFooterCard, setAddFooterCard] = useState([
    {
      groupName: null,
      grouptDesc: null,
      groupItems: [
        {
          linkName: null,
          link: null,
        },
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getFooterData();
      setIsLoading(false);
    })();
  }, []);

  const getFooterData = async () => {
    await getCrudApi("api/v1/footerConfiguration", {}).then((data) => {
      setAddFooterCard(data);
    });
  };

  const OnAddLogicArray = (index, e) => {
    const logicAJ = [...AddFooterCard];
    let group = { ...logicAJ[index] };
    let links = [...group.groupItems];
    let logicA = {
      linkName: null,
      link: null,
    };
    links.push(logicA);
    group.groupItems = links;
    logicAJ[index] = group;
    setAddFooterCard(logicAJ);
  };
  const removeRow = (e, index, linkIndex) => {
    const logicAJ = [...AddFooterCard];
    if (logicAJ[index] && logicAJ[index].groupItems) {
      logicAJ[index].groupItems.splice(linkIndex, 1);
    }
    setAddFooterCard(logicAJ);
  };
  const OnAddFooterCard = (e) => {
    e.preventDefault();
    const AddCard = [...AddFooterCard];
    if (AddCard.length < 5) {
      let cardData = {
        groupName: null,
        grouptDesc: null,
        groupItems: [{ linkName: null, link: null }],
      };

      AddCard.push(cardData);
      setAddFooterCard(AddCard);
    }
  };
  const removeCard = (e, index) => {
    const AddCard = [...AddFooterCard];
    AddCard.splice(index, 1);
    setAddFooterCard(AddCard);
  };
  const onCardDetailsChange = (index, e, value, linkIndex) => {
    let detailsChange = [...AddFooterCard];
    if (e.target.name === "groupName" || e.target.name === "grouptDesc") {
      detailsChange[index][e.target.name] = value;
    } else if (e.target.name === "linkName" || e.target.name === "link") {
      detailsChange[index]["groupItems"][linkIndex][e.target.name] = value;
    }

    setAddFooterCard(detailsChange);
  };

  const onSubmitFootercards = async () => {
    setIsLoading(true);
    let isValid = AddFooterCard?.some((group, groupIndex) => {
      if (group?.groupName?.trim() !== "") {
        return group?.groupItems?.some((child) => {
          if (
            child?.linkName &&
            child?.link &&
            child?.linkName?.trim() &&
            child?.link?.trim()
          ) {
            return false;
          } else return true;
        });
      } else {
        return true;
      }
    });

    if (!isValid) {
      let footerData = {
        links: AddFooterCard,
      };

      await postCrudApi("api/v1/footerConfiguration", footerData)
        .then((data) => {
          if (data) {
            getFooterData();
            toast.success("Updated Successfully");
          } else {
            toast.error("Operation was not performed");
          }
        })
        .catch((err) => {
          toast.error("Operation was not performed");
        });
    } else {
      toast.error("Validation failed. Please fill in all required fields.");
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="pccContainerFooter">
            <div className="addButtonContainerFooter">
              <button
                type="button"
                className="modalOpenBtnFooter"
                onClick={OnAddFooterCard}
              >
                Add
              </button>
            </div>
            <div className="footer-configuration-main">
              {AddFooterCard?.map((group, groupIndex) => {
                return (
                  <>
                    <div
                      className="Footer-Configuration-Add-div"
                      key={groupIndex}
                    >
                      <div className="headerModalFooter">
                        <h5 className="headerTitleFooter">
                          Footer Configuration
                        </h5>
                        <button
                          type="button"
                          className="footer-card-Close"
                          onClick={(e) => removeCard(group, groupIndex)}
                        >
                          <i
                            className="fa fa-close"
                            style={{ color: "white" }}
                          />
                        </button>
                      </div>
                      <div className="divDisplayFooter">
                        <label className="labelClassFooter">
                          Group Name
                          <i className="fa fa-asterisk aster-risk-Icon"></i>
                        </label>

                        <input
                          type="text"
                          name="groupName"
                          placeholder="Name"
                          onChange={(e) => {
                            onCardDetailsChange(
                              groupIndex,
                              e,
                              e.target.value,
                              null
                            );
                          }}
                          value={group?.groupName}
                          className="textboxInputFooter_1 textInputFooter"
                        />
                        {group?.groupName?.trim() === "" && (
                          <Error message={"Required*"} />
                        )}
                      </div>
                      <div className="divDisplayFooter">
                        <label className="labelClassFooter"> Description</label>
                        <input
                          type="text"
                          name="grouptDesc"
                          placeholder="Description"
                          onChange={(e) =>
                            onCardDetailsChange(
                              groupIndex,
                              e,
                              e.target.value,
                              null
                            )
                          }
                          value={group?.grouptDesc}
                          className="textboxInputFooter_1 textInputFooter"
                        />
                      </div>

                      {group.groupItems.map((element, linkIndex) => {
                        return (
                          <>
                            <div
                              className="Footer-Configuration-div"
                              key={linkIndex}
                            >
                              <div className="footer-card-close-div">
                                <button
                                  type="button"
                                  className="footer-card-Close"
                                  onClick={(e) =>
                                    removeRow(element, groupIndex, linkIndex)
                                  }
                                >
                                  <i
                                    className="fa fa-close"
                                    style={{ color: "white" }}
                                  />
                                </button>
                              </div>
                              <div>
                                <div className="divDisplayFooter">
                                  <label className="labelClassFooter">
                                    Link Title
                                    <i className="fa fa-asterisk aster-risk-Icon"></i>
                                  </label>

                                  <input
                                    type="text"
                                    placeholder="Link Title"
                                    onChange={(e) => {
                                      onCardDetailsChange(
                                        groupIndex,
                                        e,
                                        e.target.value,
                                        linkIndex
                                      );
                                    }}
                                    name="linkName"
                                    value={element?.linkName}
                                    className="textboxInputFooter_1 textInputFooter"
                                  />
                                  {element?.linkName?.trim() === "" && (
                                    <Error message={"Required*"} />
                                  )}
                                </div>
                                <div className="divDisplayFooter">
                                  <label className="labelClassFooter">
                                    Link URL
                                    <i className="fa fa-asterisk aster-risk-Icon"></i>
                                  </label>

                                  <input
                                    type="text"
                                    name="link"
                                    placeholder="Link Url"
                                    onChange={(e) => {
                                      onCardDetailsChange(
                                        groupIndex,
                                        e,
                                        e.target.value,
                                        linkIndex
                                      );
                                    }}
                                    value={element?.link}
                                    className="textboxInputFooter_1 textInputFooter"
                                  />
                                  {element?.link?.trim() === "" && (
                                    <Error message={"Required*"} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}

                      <div className="OnArrAdd">
                        <button
                          type="button"
                          className="Footer-card-Add"
                          onClick={(e) => OnAddLogicArray(groupIndex, e)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div className="ConfigSubmitButton">
            <button
              className="modalOpenBtnFooterSubmit"
              onClick={onSubmitFootercards}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </>
  );
}
