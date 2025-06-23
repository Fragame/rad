import React from 'react';
import OriginalDocItem from './index'; // Il tuo DocItem con editor
import ChapterNotes from '@site/src/components/ChapterNotes';
import AudioReader from '@site/src/components/AudioReader';

function EnhancedDocItem(props) {
  return (
    <>
      <OriginalDocItem {...props} />
      <ChapterNotes />
      <AudioReader />
    </>
  );
}

export default EnhancedDocItem;