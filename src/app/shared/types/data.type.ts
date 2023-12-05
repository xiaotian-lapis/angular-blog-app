// dummyData item type declaration
export interface DummyDataItemType {
  id: string;
  author: string;
  title: string;
  description: string;
  content: string;
}

// dummyDataList type declaration
export type DummyDataListType = DummyDataItemType[];
