/**
 * Disjoint Set Unions (DSU) are a data structure for managing groups of
 * items, where there is no overlap between groups, and over time
 * groups will need to be merged together into larger groups.
 *
 * The DSU provides 2 main pieces of functionality:
 * - Searching for what group any specific item belongs too
 * - Merging trees together
 *
 * Internally, groups are structured as trees, each tree has a
 * single root, and all other members of the group are connected
 * to the root. It's important to understand that the root is
 * itself a member, it just happens to be the member that was
 * randomly selected to be the root. The way we can determine
 * if an item is the root of a tree is if it is it's own parent.
 *
 * Groups are identified by their root, whenever we search for
 * a group, all we actually return is the element that is the
 * root of the group's tree. From there you can work out all
 * the elements that are in that group by finding all the elements
 * that have the root as their parent.
 */
export class DisjoinSetUnion<T> {
  /**
   * Rather than actually store groups of elements as arrays, we instead
   * represent the groups via a map, that has items as both its keys and
   * values. An element's corresponding value in the map is it's parent,
   * if an element is it's own parent, that means it is the root of it's
   * group.
   */
  private parents = new Map<T, T>();

  private sizes = new Map<T, number>(); // Size of each element's tree

  groupCount = 0;

  constructor(items: T[]) {
    this.groupCount = items.length;
    for (const item of items) {
      // At the start, each element is in their own set of size 1,
      // so they are their own parent
      this.parents.set(item, item);
      this.sizes.set(item, 1);
    }
  }

  private getParent(element: T): T {
    const theParent = this.parents.get(element);

    if (!theParent) throw new Error('Element not found');

    return theParent;
  }

  private getSize(element: T): number {
    const size = this.sizes.get(element);

    if (size === undefined) throw new Error('Element not found');

    return size;
  }

  /**
   * Get the root of an element's tree
   */
  findRoot(element: T): T {
    const currentParent = this.getParent(element);

    // If the element is the root of it's tree, just return it
    if (currentParent === element) {
      return element;
    }

    // We recurse up the tree, assigning this element and all of it's
    // parents that aren't already the root, to be children of the root
    // This basically flattens out the data structure while performing
    // the search, optimising future searches.
    this.parents.set(element, this.findRoot(currentParent));

    return this.getParent(element);
  }

  /**
   * Take two elements, and merge their trees together
   *
   * @return Whether or not a merge occurred (only false
   * if the trees were already joined)
   */
  mergeTrees(elementA: T, elementB: T): boolean {
    const rootA = this.findRoot(elementA);
    const rootB = this.findRoot(elementB);

    if (rootA === rootB) return false; // They are already merged

    this.groupCount -= 1;

    const sizeA = this.getSize(rootA);
    const sizeB = this.getSize(rootB);

    // We want to attach the smaller tree to the larger tree
    if (sizeA < sizeB) {
      this.parents.set(rootA, rootB);
      this.sizes.set(rootB, sizeA + sizeB);
    } else {
      this.parents.set(rootB, rootA);
      this.sizes.set(rootA, sizeA + sizeB);
    }

    return true;
  }

  findSize(element: T): number {
    return this.getSize(element);
  }

  getGroups(): T[][] {
    const groups = new Map<T, T[]>();

    this.parents.keys().forEach((el) => {
      const parent = this.findRoot(el);
      const group = groups.get(parent) ?? [];

      group.push(el);
      groups.set(parent, group);
    });

    return groups.values().toArray();
  }

  getSizes(): number[] {
    return this.getGroups().map((g) => g.length);
  }
}
