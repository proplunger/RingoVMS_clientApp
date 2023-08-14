
interface PageId {
    page: string;
    id: string;
  };
  
  const pageIds: PageId[] = [];
  
  export function addPageId(page , id) {
    pageIds.push({ page, id });
  }
  
  export function getPageId(page){
    const pageId = pageIds.find((item) => item.page ==page && item.id !=undefined);
    return pageId ? pageId.id : undefined;
  }