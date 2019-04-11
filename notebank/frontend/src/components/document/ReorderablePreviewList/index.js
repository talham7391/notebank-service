import React, { Component } from 'react';
import * as S from './styles';
import Preview from 'components/document/Preview';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Badge, Typography, Popconfirm } from 'antd';

const { Text } = Typography;

class ReorderablePreviewList extends Component {
  onDragEnd = evt => {
    if (evt.source && evt.destination) {
      const clone = this.props.files.slice();
      const el = clone.splice(evt.source.index, 1)[0];
      clone.splice(evt.destination.index, 0, el);
      this.props.onReorder(clone);
    }
  };

  render() {
    return (
      <S.ReorderablePreviewList>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId={1} direction="horizontal">
            {(provided, snapshot) => (
              <S.Droppable {...provided.droppableProps} ref={provided.innerRef}>
                {this.props.files.map((file, idx) => (
                  <Draggable key={file.url} draggableId={file.url} index={idx}>
                    {(provided, snapshot) => (
                      <S.Draggable
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <S.Badge>
                          <Badge
                            count={idx + 1}
                            style={{
                              backgroundColor: '#fff',
                              color: '#999',
                              boxShadow: '0 0 0 1px #d9d9d9 inset',
                            }}/>
                          </S.Badge>
                        <Preview file={file}/>
                        <S.Delete>
                          <Popconfirm
                            title="Are you sure you sure?"
                            okText="Yes"
                            canceText="No"
                            onConfirm={_ => this.props.onDeleteFile(file)}>
                            <Text><a>Delete</a></Text>
                          </Popconfirm>
                        </S.Delete>
                      </S.Draggable>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </S.Droppable>
            )}
          </Droppable>
        </DragDropContext>
      </S.ReorderablePreviewList>
    );
  }
}

export default ReorderablePreviewList;