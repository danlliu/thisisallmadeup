this is all made up
=
### content table:
- introduction
- figments
- figment instructions
- using instructions

### introduction

*acknowledgements*

> I preface my labs on recursion with "I hate recursion. You probably hate recursion. Let's just take a deep breath
 and pretend these next two hours never happened."
>
> *–* junlinmo
----
> mysterious, unknown  
> it's a vibe
>
> *–* abifox, regarding "joe who"
----
> who has the xxx-xxx-xxxx number?  
> *–* elanor
> 
> It is I, your conscience  
> *–* your conscience
>
> Hi your conscience  
> *–* elanor
----
> javascriptttttt
> *-* abifox


### figments

a figment is made up. figments don't exist until you need them to.

figments exist in the Table of Nonexistence, a 8x8 grid for instructions. the numbers on the left are register 1, and
 the numbers on the top are register 2.
the Table of Nonexistence holds instructions, determining how they interact with the registers of Reality.

running a figment brings it into the world of Reality. this can be done using the instructions
- `bruh` or
- `b r u h`

the `b r u h` instruction performs the same thing as the `bruh` instruction, but the extra strength wipes the figment
 from memory, erasing it forever from the Table of Nonexistence, and Reality as well.
 
### reality of figments

when a figment is run, it leaves behind a trace of itself in the form of its "reality". a figment's reality is a
 value, which is either 1 (real) or 0 (fake). this can be detected by the instruction `what wait why where when how
 ` and handled by `seems fake but ok?` and `elsewise` (see Section using instructions).

### figment instructions

the instructions that can be used inside figments are
- `i'm DONE`: set the figment's reality value to 0 and remove the figment from Reality (end execution)
- `someone send help`: set the figment's reality value to 1 and remove the figment from Reality (end execution)
- `i'm Learning`: two registers move towards the bliss of Nonexistence. adds one to the value of both registers
 specified by the Table of Nonexistence. if the instruction
 is along the diagonal of the Table, the value of that register is increased by 1
- `i'm Struggling`: a struggle for power between two registers. adds one to the value of the first register specified
 and subtracts one from the value of the
 second register specified. if the instruction is along the diagonal of the Table, the value of that register is
  decreased by 1.
- `nO`: warps the first register into Nonexistence (sets it to 0), and forces the second register to transcend
 Reality, changing its value into its additive inverse
- `ugh...h`: channels the inner frustration of Reality into the first register (sets the first register to the number
 of `h`s in the instruction)
- `uGH...H`: channels the inner frustration of Nonexistence into the first register (sets the first register to
 negative the number of `H`s in the instruction)
- `h, hh, hhh, ...`: warp locations created by the interaction of Reality and Nonexistence. each warp location allows
 figment compilation to jump forward to the nearest corresponding warp location if the two registers specified have
  the same value. program execution cannot jump back, as
  this can cause a break in the Nonexistence continuum, overloading Reality with things we just don't want to worry
   about
- `joe who`, `your conscience`: copies the values of the two specified registers to the memory of `joe who` or `your
 conscience`. the location of either of these objects is uncertain, but many speculate that they inhabit the border
  between Reality and Nonexistence. all we know is that we can store and retrieve information at will
- `whos joe`, `whos conscience?`: takes the values from either `joe who` or `your conscience`, storing them back into
 the specified registers
- `wait i need to remember this`: stores the value in the first register to a memory address defined by the second
 register. if the second register's value is negative, the value of the first register is discarded. 
- `what have i said that's so usable`: loads from the memory address corresponding to the value of the second
 register to the first register. if the second register has a negative value, the first register is set to a random
  integer between 0 and 1047
- `>:(`: expresses anger, but does nothing (noop)

when a figment is run, all instructions first get the values of the registers they need, and perform all operations
 simultaneously. register values are not updated in between figment instructions.

### running figments

there are four stages to running figments. the first stage is figment compilation. the program goes through the
 program, and decides which instructions get run. this is where the `h`, `hh`, `hhh`, `hhhh`, and `hhhhh` instructions
  come
  into play.
 compilation starts from the upper left and goes across the first row of the Table of Nonexistence, then starts on the
 second row, then on the third row, and so on. 
 
the second stage is register fetch. in this stage, all instructions get the values needed from the registers, but do not
modify the values of the registers at this point

the third stage is execute. in this stage, all instructions compute their result and remember that result

the last stage is writeback. in this stage, any instructions that need to write a result to a register do so, in
 order from top to bottom, left to right.

### using instructions
every valid program starts with the line `i'm Coding!`.

**loading figment instructions:**

every figment has a portal to reality, allowing access to its contents without bringing it into Reality. when a new
 figment is created, this portal starts in the upper left corner of the Table of Nonexistence, corresponding to
  register 0, register 0.
  
by adding a command into the flow of Reality, it will go through the portal, adding itself to the Table of
 Nonexistence. however, the portal has its own weaknesses. if it is sent the command `i.e.`, it will abandon its spot
 , and move to the right one cell. if the portal is already on the right edge, it will appear to wrap around to the
  left edge. if it is sent the command `e.g.`, it will
   abandon its spot, and move downwards one cell. again, if it is at the bottom edge, it will appear to wrap around
    to the top edge

**commands of Reality**

not all commands will alter a figment. as mentioned before, the commands `bruh` and `b r u h` will bring figments
 into Reality. the command `what wait why where when how` is used to get the reality value of a figment after it is
  run. this can only be done right after the figment runs, or the reality value will disappear into Nothingness. running the
   command `seems fake
   but ok?` will jump to the corresponding `elsewise` if the reality value
   of 0
   (fake). if we run a `seems fake but ok?` instruction and we run into its corresponding `elsewise`, we jump to the
    next `progress!!` instruction. the corresponding `elsewise` makes sure that nested 
    `seems fake but ok?` statements will work. for example,
    
    what wait why where when how
    seems fake but ok? (1)
    ...
    seems fake but ok? (2)
    ...
    elsewise (2)
    ...
    progress!! (2)
    elsewise (1)
    ...
    progress!! (1)
    
the `(1)` and `(2)` denote which instructions are part of the same group 

a comment is declared using the syntax `lol {comment}`.

branches are declared by `how did we jump from {line-num} to {line-num}`. these are always unconditional branches and
 all
branches must be declared after the instructions. having a branch from a comment is allowed. branching from a `seems
 fake but ok?` statement will override the behavior of `seems fake but ok?`. branching from a `elsewise` instruction
  does the same as if the `elsewise` was at the new location, but still corresponding to the same `seems fake but ok?`.
  when execution reaches a line which has a branch specified, the next instruction to be executed is the one
   specified by the second entry of the branch instruction.
branch instructions override previous branch instructions 
