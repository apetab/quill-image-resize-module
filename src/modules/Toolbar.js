import IconAlignLeft from 'quill/assets/icons/align-left.svg';
import IconAlignCenter from 'quill/assets/icons/align-center.svg';
import IconAlignRight from 'quill/assets/icons/align-right.svg';
import { BaseModule } from './BaseModule';

export class Toolbar extends BaseModule {
    onCreate = () => {
		// Setup Toolbar
        this.toolbar = document.createElement('div');
        Object.assign(this.toolbar.style, this.options.toolbarStyles);
        this.overlay.appendChild(this.toolbar);

        const Parchment = this.quill.imports.parchment;
        this.floatStyle = new Parchment.Attributor.Style('float', 'float');
        this.marginStyle = new Parchment.Attributor.Style('margin', 'margin');
        this.displayStyle = new Parchment.Attributor.Style('display', 'display');

        // Setup Buttons
        this._defineAlignments();
        this._addToolbarButtons();
    };

	// The toolbar and its children will be destroyed when the overlay is removed
    onDestroy = () => {};

	// Nothing to update on drag because we are are positioned relative to the overlay
    onUpdate = () => {};

    _defineAlignments = () => {
        this.alignments = [
            {
                icon: IconAlignLeft,
                apply: () => {
                    this.displayStyle.add(this.img, 'inline');
                    this.floatStyle.add(this.img, 'left');
                    this.marginStyle.add(this.img, '0 1em 1em 0');
                },
                isApplied: () => this.floatStyle.value(this.img) == 'left',
            },
            {
                icon: IconAlignCenter,
                apply: () => {
                    this.displayStyle.add(this.img, 'block');
                    this.floatStyle.remove(this.img);
                    this.marginStyle.add(this.img, 'auto');
                },
                isApplied: () => this.marginStyle.value(this.img) == 'auto',
            },
            {
                icon: IconAlignRight,
                apply: () => {
                    this.displayStyle.add(this.img, 'inline');
                    this.floatStyle.add(this.img, 'right');
                    this.marginStyle.add(this.img, '0 0 1em 1em');
                },
                isApplied: () => this.floatStyle.value(this.img) == 'right',
            },
        ];
    };

    _addToolbarButtons = () => {
		const buttons = [];
		this.alignments.forEach((alignment, idx) => {
			const button = document.createElement('span');
			buttons.push(button);
			button.innerHTML = alignment.icon;
			button.addEventListener('click', () => {
					// deselect all buttons
				buttons.forEach(button => button.style.filter = '');
				if (alignment.isApplied()) {
						// If applied, unapply
					this.floatStyle.remove(this.img);
					this.marginStyle.remove(this.img);
					this.displayStyle.remove(this.img);
				}				else {
						// otherwise, select button and apply
					this._selectButton(button);
					alignment.apply();
				}
					// image may change position; redraw drag handles
				this.requestUpdate();
			});
			Object.assign(button.style, this.options.toolbarButtonStyles);
			if (idx > 0) {
				button.style.borderLeftWidth = '0';
			}
			Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
			if (alignment.isApplied()) {
					// select button if previously applied
				this._selectButton(button);
			}
			this.toolbar.appendChild(button);
		});
    };

    _selectButton = (button) => {
		button.style.filter = 'invert(20%)';
    };

}
