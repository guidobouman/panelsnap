import PanelSnap from './panelsnap';

describe('Constructor', () => {
  test('can init PanelSnap', () => {
    const instance = new PanelSnap();
    expect(instance).toBeInstanceOf(PanelSnap);
  });

  test('prevents duplicate init of PanelSnap on the same element', () => {
    // On default container: body
    expect(() => [
      new PanelSnap(),
      new PanelSnap(),
    ]).toThrow('already initialised');

    // On custom element
    const container = document.createElement('div');
    expect(() => [
      new PanelSnap({ container }),
      new PanelSnap({ container }),
    ]).toThrow('already initialised');
  });
});
