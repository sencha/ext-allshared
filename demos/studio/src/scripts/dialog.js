//not used - events are in draganddrop.js
Ext.on("viewportready", function() {
    const modal = document.getElementById('demo-modal');
//    const open = document.getElementById('open-modal');
    const close = document.getElementById('close');
//    const likeIt = document.getElementById('like-it');
    const loveIt = document.getElementById('love-it');
//    const returnSpan = document.getElementById('return-value');

    //dialogPolyfill.registerDialog(modal);
    // open.addEventListener('click', () => {
    // modal.showModal();
    // });

    // likeIt.addEventListener('click', () => {
    // modal.close('Like it');
    // });

    close.addEventListener('click', () => {
    modal.close('cancelled');
    })

    modal.addEventListener('cancel', () => {
    modal.close('cancelled');
    });

    // close when clicking on backdrop
    modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.close('cancelled');
    }
    });

    // display returnValue
    modal.addEventListener('close', () => {
    console.log(modal.returnValue)
    });
});

