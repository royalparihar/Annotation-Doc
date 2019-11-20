
export const splitItems = (textArr, selectedValues) => {
  const splits = [];
  textArr.forEach((text, index) => {
    const isSelected = selectedValues.find(({ start }) => index === start);
    splits.push({
      content: text,
      index,
      color: isSelected ? 'yellow' : ''
    });
  });
  return splits;
};

export const checkBackwardSelection = (selection) => {
  const position = selection.anchorNode.compareDocumentPosition(selection.focusNode);

  let backward = false;
  if (
    (!position && selection.anchorOffset > selection.focusOffset)
    || position === Node.DOCUMENT_POSITION_PRECEDING
  ) backward = true;

  return backward;
};
