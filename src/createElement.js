import { omit, isClassComponent } from './utils';
import { brahmosNode, TAG_ELEMENT_NODE, CLASS_COMPONENT_NODE, FUNCTIONAL_COMPONENT_NODE } from './brahmosNode';

/**
 * Convert create element with native tags to BrahmosTagElement.
 * A BrahmosTagElement tag element can be used in similar way as
 * tagged template literals.
 * This are generated by similar use-case
 * createElement('div', props, children);
 */
export function createTagElement (element, configs, children) {
  const node = brahmosNode(null, [configs, children], '');
  node.element = element;
  node.nodeType = TAG_ELEMENT_NODE;
  return node;
}

export default function createElement (
  element,
  configs,
  children,
) {
  /**
   * If the create element is receiving an string element it means it is not a component,
   * but a simple tag instead. In that case return a tagElement instance.
   */
  if (typeof element === 'string') return createTagElement(element, configs, children);

  // create a prop object excluding the key and ref prop and adding children prop
  const props = { ...element.defaultProps, ...omit(configs, { key: 1, ref: !element.__isForwardRef }), children };

  const { key = '', ref } = configs;
  const _isClassComponent = isClassComponent(element);

  const node = brahmosNode(props, null, '' + key);

  node.nodeType = _isClassComponent ? CLASS_COMPONENT_NODE : FUNCTIONAL_COMPONENT_NODE;
  node.type = element;
  node.ref = _isClassComponent ? ref : null;

  return node;
}
