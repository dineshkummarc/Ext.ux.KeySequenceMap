/*
 * Ext.ux.KeySequenceMap
 *
 * Copyright (c) 2011 Florian Cargoët (http://fcargoet.evolix.net/)
 * Licensed under the GPLv3
 *
 * TODO :
 *  - use a Ext.util.DelayedTask to reset the sequencePointer after a configurable delay.
 *  - check if this code is eligible for Licence Exception http://www.sencha.com/products/ux-exception.php since it reuses only tiny bits of library code.
 */
 
Ext.ns('Ext.ux');
Ext.ux.KeySequenceMap = Ext.extend(Ext.KeyMap, {
    addBinding : function(config){
        if(Ext.isArray(config)){
            Ext.each(config, function(c){
                this.addBinding(c);
            }, this);
            return;
        }
        
        var keySequence = config.sequence,
            fn = config.fn || config.handler,
            scope = config.scope,
            sequencePointer = 0,
            sequenceLength;

        if (config.stopEvent) {
            this.stopEvent = config.stopEvent;
        }

        if(typeof keySequence == "string"){
            var ks = [];
            var keyString = keySequence.toUpperCase();
            for(var j = 0, len = keyString.length; j < len; j++){
                ks.push(keyString.charCodeAt(j));
            }
            keySequence = ks;
        }
        //make it an array if needed
        if(!Ext.isArray(keySequence)){
            keySequence = [keySequence];
        }
        sequenceLength = keySequence.length;
        
        var handler = function(e){
            if(this.checkModifiers(config, e)){
                var k = e.getKey();
                if(keySequence[sequencePointer] == k){
                    //matches the current key
                    if(this.stopEvent){
                        e.stopEvent();
                    }
                    sequencePointer++;
                }else{
                    //bad key
                    sequencePointer = 0;
                    //but may be it matches the first !
                    /*
                     * if the sequence is abcd and you press ABABCD
                     * you probably want it to match
                     * the 2nd A is a bad key but it may also be the first key of a new attempt
                     */
                    if(keySequence[0] == k){
                        //matches the first key indeed
                        if(this.stopEvent){
                            e.stopEvent();
                        }
                        sequencePointer++;
                    }
                }
                if(sequencePointer == sequenceLength){
                    //matches the full sequence
                    sequencePointer = 0;
                    fn.call(scope || window, k, e);
                    return;
                }
            }
        };
        this.bindings.push(handler);
    },
});