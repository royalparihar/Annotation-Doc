import React, { Component } from 'react';
import './app.css';
import { remove, isEmpty } from 'lodash';
import { splitItems, checkBackwardSelection } from './utils';
import Mark from './Mark';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { id: null, selectedValues: [], words: [] };
    this.contentRef = React.createRef();
  }


  componentDidMount() {
    fetch('/api/getFile')
      .then(res => res.json())
      .then((data) => {
        this.setState({
          id: data._id,
          words: data.words,
          selectedValues: data.selectedWords,
        });
      });
    this.contentRef.current.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    this.contentRef.current.removeEventListener('mouseup', this.handleMouseUp);
  }

  onSelection = (value) => {
    const { selectedValues } = this.state;
    const removedItem = remove(selectedValues, item => value.start === item.start);
    if (!isEmpty(removedItem)) {
      this.setState({
        selectedValues: [
          ...selectedValues
        ]
      });
    } else {
      this.setState({
        selectedValues: [
          ...selectedValues,
          value
        ]
      });
    }
  }

  handleMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    const { words } = this.state;

    if (!selectedText) return;

    if (
      !selection.anchorNode.parentElement.hasAttribute('data-i')
      || !selection.focusNode.parentElement.hasAttribute('data-i')
    ) {
      window.getSelection().empty();
      return;
    }

    let start = parseInt(selection.anchorNode.parentElement.getAttribute('data-i'), 10);
    let end = start + 1;
    if (checkBackwardSelection(selection)) {
      [start, end] = [end, start];
    }

    this.onSelection(
      {
        start, end, word: words.slice(start, end)[0], color: 'yellow'
      },
    );
    window.getSelection().empty();
  }

  saveSelection = () => {
    const { selectedValues, id } = this.state;
    fetch('/api/saveSelection', {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ selectedValues, id })
    }).then(response => response.json()).then((data) => {
      window.alert('Selection saved', data);
    });
  }

  render() {
    const { words, selectedValues } = this.state;
    const splits = splitItems(words, selectedValues);
    return (
      <div>
        {!isEmpty(selectedValues)
        && (
        <button
          type="button"
          style={{ marginTop: '30px' }}
          onClick={this.saveSelection}
        >
          Save Selection(s)
        </button>
        )}
        <div
          className="content"
          ref={this.contentRef}
        >
          {splits.map(
            split => (
              <Mark
                color={split.color || 'black'}
                index={split.index}
                content={split.content}
              />
            )
          )}
        </div>
      </div>
    );
  }
}
